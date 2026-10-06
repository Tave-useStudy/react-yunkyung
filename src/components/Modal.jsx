import { createContext, use, useEffect, useId, useRef } from 'react';

const ModalContext = createContext(null);

function useModal() {
  const context = use(ModalContext);
  if (context === null) throw new Error('Modal.* 컴포넌트는 <Modal.Root> 안에서만 쓸 수 있습니다.');
  return context;
}

// 범용 모달 (compound component). import * as Modal from './Modal' 로 불러서 Modal.Root ... 로 쓴다.
// 열림 여부(open)는 부모가 정하고, 닫아 달라는 요청만 onClose로 올려 보낸다.
// <dialog>.showModal()을 쓰면 ESC 닫기, 뒤쪽 클릭 막기, 포커스 가두기를 브라우저가 해 준다.
export function Root({ open, onClose, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  // open state → 실제 <dialog> 열기/닫기 (DOM이라는 외부 시스템과 동기화)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // 바깥 어두운 영역(= dialog 자신)을 누르면 닫기. 안쪽 내용을 누르면 target이 내용 요소라 닫히지 않는다
  const handleClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
    >
      {open ? (
        <ModalContext value={{ titleId, onClose }}>
          <div className="modal-content">{children}</div>
        </ModalContext>
      ) : null}
    </dialog>
  );
}

export function Title({ children }) {
  const { titleId } = useModal();
  return (
    <h2 id={titleId} className="modal-title">
      {children}
    </h2>
  );
}

export function Body({ children }) {
  return <div className="modal-body">{children}</div>;
}

export function Footer({ children }) {
  return <div className="modal-footer">{children}</div>;
}

export function Close({ children = '닫기' }) {
  const { onClose } = useModal();
  return (
    <button type="button" onClick={onClose}>
      {children}
    </button>
  );
}

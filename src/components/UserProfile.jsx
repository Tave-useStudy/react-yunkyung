import { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://randomuser.me/api/');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setUser(data.results[0]); // 실제 유저 정보는 results 배열의 0번째
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 처음 화면에 나타날 때 한 번 호출
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <section className="user-profile">
      <h2>랜덤 유저</h2>
      {loading && <p>불러오는 중...</p>}
      {error && <p className="warning">에러: {error}</p>}
      {user && !loading && (
        <div className="user-card">
          <img src={user.picture.large} alt="유저 프로필 사진" />
          <p className="user-name">
            {user.name.first} {user.name.last}
          </p>
          <p className="user-email">{user.email}</p>
        </div>
      )}
      <button type="button" onClick={fetchUser} disabled={loading}>
        새로고침
      </button>
    </section>
  );
}

export default UserProfile;

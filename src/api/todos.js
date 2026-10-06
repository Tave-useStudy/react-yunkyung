const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 한 번에 가져올 개수. 이미 가져온 항목은 빼고 다음 것부터 가져온다.
export const API_PAGE_SIZE = 10;

async function fetchJson(path, signal) {
  const res = await fetch(`${BASE_URL}${path}`, { signal });
  // fetch는 404 / 500이어도 reject하지 않는다 → 직접 확인해야 한다
  if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
  return res.json();
}

// JSONPlaceholder의 할 일 + 작성자 이름을 가져와서 앱에서 쓰기 좋은 모양으로 바꾼다.
// excludeIds: 이미 가져온 API 할 일 id(Set)
export async function fetchApiTodos({ signal, excludeIds, limit = API_PAGE_SIZE }) {
  // 두 요청을 동시에 시작한다 (순서대로 await하면 두 요청 시간이 더해진다)
  // 작성자 이름은 없어도 되는 정보라 실패하면 빈 배열로 대신한다
  const usersPromise = fetchJson('/users', signal).catch(() => []);
  const apiTodos = await fetchJson('/todos', signal);

  const fresh = apiTodos.filter((todo) => !excludeIds.has(todo.id)).slice(0, limit);

  // 새로 가져올 게 없으면 작성자 정보는 필요 없으니 기다리지 않고 바로 끝낸다
  if (fresh.length === 0) return [];

  const users = await usersPromise;
  // userId → 이름을 Map으로 한 번 만들어 두면 할 일마다 users.find()를 돌 필요가 없다
  const nameById = new Map(users.map((user) => [user.id, user.name]));

  return fresh.map((todo) => ({
    sourceId: todo.id,
    title: todo.title,
    done: todo.completed,
    author: nameById.get(todo.userId) ?? `사용자 ${todo.userId}`,
  }));
}

import { serverName } from "./api";

async function postJSON(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  }

  return await res.json();
}

async function postStream(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  }

  if (!res.body) {
    throw new Error("ReadableStream not supported in this environment");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  // Return an async generator that yields chunks
  return (async function* () {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  })();
}

export const ChatAPI = {
  send: (question: string) => postJSON(`${serverName}/api/chat`, { question, stream: false }),
  stream: (question: string) => postStream(`${serverName}/api/chat`, { question, stream: true }),
};
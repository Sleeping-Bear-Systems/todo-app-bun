export type TaskState = { status: "Unknown" };

export function initialState(): TaskState {
  return { status: "Unknown" };
}

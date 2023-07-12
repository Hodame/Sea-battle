import { Cell } from "@/logic/board"
import { ref } from "vue"

function board() {
  const board = ref<Cell[] | null>(null)

  const get = () => (board.value ? board.value : null)
  const set = (value: Cell[]) => (board.value = value)

  return {
    get,
    set,
  }
}

export const useBoard = board()

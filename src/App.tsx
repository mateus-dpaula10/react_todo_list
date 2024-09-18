import { useEffect, useState, useRef, useMemo, useCallback } from "react";

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const firstRender = useRef(true)
  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState<string[]>([])
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: ""
  })

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("@cursoreact")
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas))
    }
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return;
    }
    localStorage.setItem("@cursoreact", JSON.stringify(tasks))
  }, [tasks])

  const adicionarTarefa = useCallback(() => {
    if (!input) {
      alert("Digite alguma tarefa!")
      return; 
    }
  
    if (editTask.enabled) {
      editarTarefa()
      return;
    }
  
    setTasks(tarefas => [...tarefas, input])
    setInput("")
  }, [input, tasks])

  function editTarefa(item: string) {
    inputRef.current?.focus()
    setInput(item)
    setEditTask({
      enabled: true,
      task: item
    })
  }

  function editarTarefa() {
    const tarefaEditada = tasks.findIndex(task => task === editTask.task)
    const todasTarefas = [...tasks]
    todasTarefas[tarefaEditada] = input
    setTasks(todasTarefas)
    setInput("")
    setEditTask({
      enabled: false,
      task: ""
    })
  }

  function deletarTarefa(item: string) {
    const tarefaDeletada = tasks.filter(task => task !== item)
    setTasks(tarefaDeletada)
  }

  const totalTarefas = useMemo(() => {
    return tasks.length
  }, [tasks])

  return (
    <div>
      <h1>Lista de tarefas</h1>
      <input
        placeholder="Digite uma tarefa..."
        value={input}
        onChange={ (e) => setInput(e.target.value) }
        ref={inputRef}
      />
      <button onClick={adicionarTarefa}>
        {editTask.enabled ? "Atualizar" : "Cadastrar"}
      </button>

      <hr />

      <strong>Você tem {totalTarefas} tarefas!</strong>

      <br />
      <br />

      {tasks.map( (item, index) => (
        <div key={item}>
          {item}
          <button onClick={ () => editTarefa(item) }>Editar</button>
          <button onClick={ () => deletarTarefa(item) }>Deletar</button>
        </div>
      ) )}
    </div>
  )
}
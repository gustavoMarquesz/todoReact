import { useState, useEffect } from "react"
import todoPage from "../pages/todoPage.css"
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill, BsFillBookmarkCheckFill} from "react-icons/bs"

const API = "http://localhost:5000"

function TodoPage (){
    const [title, setTitle] = useState("")
    const [time, setTime] = useState("")
    const [todo, setTodo] =  useState([])
    const [loading, setLoading] = useState()


    useEffect(()=>{
        const loadInPage = async () => {
            setLoading(true)

            const res = await fetch(API + "/todos",{method:"GET"})
                .then((res) => res.json())
                .then((data) => data)
                .catch((error) => console.log(error));

            setLoading(false);
            setTodo(res);
        }
       loadInPage();
    }, [])


    const handleSubmit = async (e) =>{
        e.preventDefault()

        // o back-end espera um todo em forma de objeto, então aqui vai
       const todo = {id: Math.random(), title, time, done: false}
       // Um objeto com id fictício, titulo to dodo, time e feito como false

      // agora vamos nos comunicar com a API fictícia
      await fetch(API +"/todos", {
        method:"POST",
        body: JSON.stringify(todo),
        headers: {"Content-Type":"application/json"}})
      // o Fetch precisa do nome da API, o method, body e o headers


      setTodo((prevState) => [...prevState, todo]);
      // com o prevState eu não preciso atualizar a página para aparecer os novos todos

      setTitle("")
      setTime("")
      console.log(todo)
    };

    const handleDelete = async (id) => {
        await fetch(API + "/todos/" + id, {method: "DELETE"})
        setTodo((prevState) => prevState.filter((todo)=> todo.id !== id));
    }

    const handleDone = async (todo) => {
        todo.done = !todo.done;

        const data =  await fetch(API +"/todos/"+ todo.id, {
            method:"PUT",
            body: JSON.stringify(todo),
            headers: {"Content-Type":"application/json"}})

        setTodo((prevState)=> prevState.map((t)=> (t.id === data.id ? (t = data) : t)));// revisar essa parte, tive dificuldade
    }

    if (loading){
        return <p>carregando suas tarefas...</p>
    }
    return(
        <section className="todoContainer">
            <h2>Todo-List</h2>
            <form onSubmit={handleSubmit}>
                <div className="tasks">
                    <span>Tarefa: </span>
                    <input required name="task" type="text" value={title || ""} onChange={(e) => {setTitle(e.target.value)}}/>
                </div>

                <div className="time">
                    <label htmlFor="time">Duração da tarefa: </label>
                    <input required name="time" type="text" value={time || ""} onChange={(e) => {setTime(e.target.value)}}/>
                </div>

                <div  className="inputSubmit">
                    <input type="submit"/>
                </div>
                

                <div className="tasksContainer">
                    <h3>Sua Lista de tarefas:</h3>
                    {todo.length === 0 && <p>Não existem tarefas</p>}
                    {todo.map((todos) => (
                        <div className="todosRender" key={todos.id}>
                            <p className={todos.done ? "todoDone" : ""}>Tarefa: {todos.title}</p>
                            <p className={todos.done ? "todoDone" : ""}>Você tem: {todos.time} de duração</p>

                            <div className="actions">
                                <span onClick={()=> handleDone(todos)}>{!todos.done ? <BsBookmarkCheck/> : <BsFillBookmarkCheckFill/>}</span>
                                <BsTrash className="trash"  onClick={() => handleDelete(todos.id)}/>
                            </div>
                        </div>
                       
                    ))}

                </div>
            </form>
        </section>
    )

}
export default TodoPage
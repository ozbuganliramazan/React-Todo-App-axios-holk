import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [duzenlemeVarMi, setDuzenlemeVarMi] = useState(false);
  const [duzenlenecekTodo, setDuzenlenecekTodo] = useState(null);
  const [duzenlenecekTitle, setDuzenlenecekTitle] = useState("");
  const todoSil = (id) => {
    axios
      .delete(`http://localhost:3004/todos/${id}`)
      .then((response) => {
        setResult(true);
        setResultMessage("Silme İşlemi Başarılı");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Silme işlemi esnaında bir hata oluştu");
      });
  };

  const changeTodosCompleted = (todo) => {
    const updateTodo = {
      ...todo,
      completed: !todo.completed,
    };
    axios
      .put(`http://localhost:3004/todos/${todo.id}`, updateTodo)
      .then((response) => {
        setResult(true);
        setResultMessage("Todo başarılı gücellendi");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Todo gücellenirken bir hata oluştu !");
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3004/todos")
      .then((response) => {
        console.log(response.data);
        setTodolar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [result]);

  const handelsubmit = (event) => {
    event.preventDefault();
    //validation
    if (title === "") {
      alert("yapılacak iş boş brakılamaz");
      return;
    }
    // create and save todo
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false,
    };

    axios
      .post("http://localhost:3004/todos", newTodo)
      .then((response) => {
        setTitle("");
        setResult(true);
        setResultMessage("Kayıt İşlemi Başarılı..");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Kaydederken bir hata oluştu");
      });
  };

  const todoGuncelleFormDenetle = (event) => {
    event.preventDefault();
    //validation
    if (duzenlenecekTitle === "") {
      alert("Title Boş bırakılamaz");
      return;
    }
    // update todo and send server
    const updatedTodo = {
      ...duzenlenecekTodo,
      title: duzenlenecekTitle,
    };
    axios
      .put(`http://localhost:3004/todos/${updatedTodo.id}`, updatedTodo)
      .then((response) => {
        setResult(true);
        setResultMessage("Güncelleme işlemi başarılı");
        setDuzenlemeVarMi(false)
      })
      .catch((error) => {});
      setResult(true)
      setResultMessage("Güncelleme işleminde bir hata oluştu")
  };

  if (todolar === null) {
    return null;
  }

  return (
    <div className="container">
      {result === true && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div className="alert alert-success" role="alert">
            <p> {resultMessage}</p>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => setResult(false)}
                className="btn btn-sm btn-outline-primary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="row my-5">
        <form onSubmit={handelsubmit}>
          <div className="input-group mb-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              className="form-control"
              placeholder="Type yuo todo..."
            />
            <button className="btn btn-sm btn-primary" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
      {duzenlemeVarMi === true && (
        <div className="row  my-5">
          <form onSubmit={todoGuncelleFormDenetle}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Type yuo todo..."
                value={duzenlenecekTitle}
                onChange={(event) => setDuzenlenecekTitle(event.target.value)}
              />
              <button
                onClick={() => setDuzenlemeVarMi(false)}
                className="btn btn-sm btn-danger"
              >
                Vazgeç
              </button>
              <button className="btn btn-sm btn-primary " type="submit">
                Güncelle
              </button>
            </div>
          </form>
        </div>
      )}
      {todolar.map((todo) => (
        <div
          key={todo.id}
          className="alert alert-secondary d-flex justify-content-between align-items-center"
          role="alert"
        >
          <div>
            <h1
              style={{
                textDecoration:
                  todo.completed === true ? "line-through" : "none",
                color: todo.completed === true ? "red" : "black",
              }}
            >
              {todo.title}{" "}
            </h1>
            <p>{new Date(todo.date).toLocaleString()} </p>
          </div>
          <div>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                onClick={() => {
                  setDuzenlemeVarMi(true);
                  setDuzenlenecekTodo(todo);
                  setDuzenlenecekTitle(todo.title);
                }}
                type="button"
                className="btn btn-sm btn-warning"
              >
                Düzenle
              </button>
              <button
                onClick={() => todoSil(todo.id)}
                type="button"
                className="btn  btn-sm btn-danger"
              >
                Sill
              </button>
              <button
                onClick={() => changeTodosCompleted(todo)}
                type="button"
                className="btn btn-sm btn-success"
              >
                {todo.completed === true ? "Yapılmadı" : "Yapıldı"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;

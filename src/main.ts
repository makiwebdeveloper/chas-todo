import { createSupabaseClient } from "./services/supabase-client";
import { AuthService } from "./services/auth-service";
import { TodosService } from "./services/todos-service";
import { TodoComplexity, TodoStatus } from "./types/todos.types";

// Initialize services
const supabase = createSupabaseClient();

const authService = new AuthService(supabase);
const todosService = new TodosService(supabase, authService);

// DOM Elements
const googleBtn = document.getElementById("googleBtn") as HTMLButtonElement;
const profileBtn = document.getElementById("profileBtn") as HTMLButtonElement;
const todosTitle = document.getElementById(
  "todosTitle"
) as HTMLParagraphElement;
const todosList = document.getElementById("todosList") as HTMLUListElement;
const createTodoForm = document.getElementById(
  "createTodoForm"
) as HTMLFormElement;

// Functions
async function updateProfile() {
  const user = await authService.getUser();

  if (user) {
    googleBtn.style.display = "none";
    profileBtn.style.display = "block";
    profileBtn.innerHTML = `
      <img class="header__profile-img" src="${user.user_metadata?.avatar_url}" alt="${user.user_metadata?.name}" />
    `;
    createTodoForm.style.display = "flex";
  } else {
    googleBtn.style.display = "flex";
    profileBtn.style.display = "none";
    profileBtn.innerHTML = "";
    createTodoForm.style.display = "none";
  }
}

async function renderTodos() {
  const user = await authService.getUser();

  if (user) {
    const todos = await todosService.getAll();

    todosTitle.innerHTML = `You've got <span>${todos.length} task</span> today`;

    const todosHtml = todos
      .sort(
        (a, b) =>
          Number(a.status === TodoStatus.COMPLETED) -
          Number(b.status === TodoStatus.COMPLETED)
      )
      .map(
        (todo, idx) => `
          <li class="todo">
            ${
              todo.status === TodoStatus.COMPLETED
                ? `<div class="todo-divider"></div>`
                : ``
            }
            <p class="todo__text"><span class="todo-dot" style="animation-delay: ${
              idx / 4
            }s;"></span>${todo.text}</p>
            <div class="todo__info">
              <p>${todo.complexity}</p>
              <p>${todo.status === TodoStatus.COMPLETED}</p>
              <button data-id="${todo.id}" id="completeTodoBtn" ${
          todo.status === TodoStatus.COMPLETED ? "disabled" : ""
        }>${
          todo.status === TodoStatus.PENDING ? "Complete" : "Completed"
        }</button>
              <button data-id="${todo.id}" id="deleteTodoBtn">Delete</button>
            </div>
          </li>
        `
      )
      .join("");
    todosList.innerHTML = todosHtml;

    // Delete todo event
    const deleteBtns = document.querySelectorAll("#deleteTodoBtn");
    deleteBtns.forEach((button) => {
      button.addEventListener("click", async (e) => {
        // @ts-ignore
        const todoId = e.target?.dataset?.id;

        await todosService.delete(todoId);

        renderTodos();
      });
    });

    // Complete todo event
    const completeBtns = document.querySelectorAll("#completeTodoBtn");
    completeBtns.forEach((button) => {
      button.addEventListener("click", async (e) => {
        // @ts-ignore
        const todoId = e.target?.dataset?.id;

        await todosService.complete(todoId);

        renderTodos();
      });
    });
  } else {
    todosTitle.innerHTML = `Sign in to use this <span>fantastique</span> todo app`;
    todosList.innerHTML = "";
  }
}

updateProfile();
renderTodos();

// Event listeners
googleBtn.addEventListener("click", async () => {
  await authService.signInWithGoogle();
  updateProfile();
  renderTodos();
});

profileBtn.addEventListener("click", async () => {
  await authService.signOut();
  updateProfile();
  renderTodos();
});

createTodoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(
    document.getElementById("createTodoForm") as HTMLFormElement
  );
  const values = Object.fromEntries(formData.entries()) as {
    text: string;
    complexity: TodoComplexity;
  };

  await todosService.create(values);

  await renderTodos();
});

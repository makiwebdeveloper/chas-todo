import { SupabaseClient } from "@supabase/supabase-js";
import { AuthService } from "./auth-service";
import { ICreateTodoBody, ITodo, TodoStatus } from "../types/todos.types";

export class TodosService {
  constructor(private db: SupabaseClient, private authService: AuthService) {}

  async getAll(): Promise<ITodo[]> {
    const user = await this.authService.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await this.db
      .from("todos")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error?.message);
    }

    return data;
  }

  async getById(todoId: string): Promise<ITodo | undefined> {
    const user = await this.authService.getUser();

    if (!user) {
      return undefined;
    }

    const { data, error } = await this.db
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .eq("id", todoId);

    if (error) {
      throw new Error(error?.message);
    }

    if (data.length > 0) {
      return data[0];
    } else {
      return undefined;
    }
  }

  async create(body: ICreateTodoBody) {
    const user = await this.authService.getUser();

    if (!user) {
      throw new Error("Forbidden");
    }

    const { error } = await this.db.from("todos").insert({
      text: body.text,
      complexity: body.complexity,
      status: TodoStatus.PENDING,
      user_id: user.id,
    });

    if (error) {
      throw new Error(error?.message);
    }
  }

  async complete(todo_id: string) {
    const todo = await this.getById(todo_id);

    if (!todo) {
      throw new Error("Todo is not exist");
    }

    const { error } = await this.db
      .from("todos")
      .update({ status: TodoStatus.COMPLETED })
      .eq("id", todo_id)
      .select("*");

    if (error) {
      throw new Error(error?.message);
    }
  }

  async delete(todoId: string) {
    const { error } = await this.db.from("todos").delete().eq("id", todoId);

    if (error) {
      throw new Error(error?.message);
    }
  }
}

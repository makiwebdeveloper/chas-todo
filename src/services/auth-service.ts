import { SupabaseClient } from "@supabase/supabase-js";

export class AuthService {
  constructor(private db: SupabaseClient) {}

  async signInWithGoogle() {
    await this.db.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async signOut() {
    await this.db.auth.signOut();
  }

  async getUser() {
    const { data } = await this.db.auth.getUser();

    return data.user;
  }
}

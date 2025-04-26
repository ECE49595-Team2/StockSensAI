class User {
    public email?: string;
    public name?: string;
    public prefs: { [key: string]: any } = {};

    public async fetchUserData() {
        const response = await fetch("/api/user/prefs/", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });
        const data = await response.json();
        this.name = data.rows[0] ? data.rows[0].value.name : "";
    }

    constructor(email?: string, name?: string) {
        this.email = email;
        this.name = name;
    }

    public toJson(): string {
        return JSON.stringify(this);
    }
}



export default User;
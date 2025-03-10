export enum Avatar {
    Avatar1 = '/avatar-1.png',
    Avatar2 = '/avatar-2.png',
    Avatar3 = '/avatar-3.png',
    Avatar4 = '/avatar-4.png',
}

class User {
    public email?: string;
    public name?: string;
    // public portfolio: PortfolioPortfolio
    public prefs: { [key: string]: any } = {};

    public async fetchUserData() {
        const response = await fetch("/api/user/details", {
            method: "POST",
            credentials: "include",
            cache: "no-store",
            body: JSON.stringify({ email: this.email })
        });
        console.log(response);
        const data = await response.json();
        console.log("data", data);
        Object.keys(data).forEach((key) => {
            if (key !== "name")
                this.prefs[key] = data.prefs[key];
        });
        this.name = data.prefs.name;
    }

    constructor(email?: string, name?: string) {
        this.email = email;
        this.name = name;
        console.log("EMAIL", this.email);
    }

    public toJson(): string {
        return JSON.stringify(this);
    }
}



export default User;
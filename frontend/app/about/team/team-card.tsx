import { Card, CardContent, CardTitle } from "@/shadcn/ui/card";

export class TeamMember {
    public name: string;
    public role: string;
    public description?: string;
    public imageUrl?: string;
    public linkedInUrl?: string;
    public githubUrl?: string;

    constructor(name: string, role: string, description: string) {
        this.name = name;
        this.description = description;
        this.role = role;
    }
}

function TeamCard({ member }: { member: TeamMember }) {
    return(
        <Card className="max-w-xl sm:w-full w-[80%] h-[300px] pl-4 pr-4 pt-16 pb-16 user-select-none" style={{ userSelect: "none" }}>
            <CardTitle className="text-2xl font-bold mb-4">
            {member.name}
            </CardTitle>
            <CardContent>
            <h2>Role: {member.role}</h2>
            <p>{member.description}</p>
            </CardContent>  
        </Card>
    );
}

export default TeamCard;
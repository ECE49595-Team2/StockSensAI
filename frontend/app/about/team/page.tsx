import Page from "@/components/new-page";
import TeamCard from "./team-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shadcn/ui/carousel";

export class TeamMember {
    public name: string;
    public role: string;
    public description?: string;
    public imageUrl?: string;
    public linkedInUrl?: string;
    public githubUrl?: string;

    constructor(name: string, role: string, description: string) {
        this.name = name;
        this.role = role;
    }
}

let teamMembers: TeamMember[] = [
    new TeamMember("Lane Crowder", "UX Designer, Frontend Engineer", "Lane is interested in UX design and software development. He is currently a senior at Purdue University."),
    new TeamMember("Brett Heckman", "Algorithmic Trader Engineer", ""),
    new TeamMember("Kevin DeWall", "LLM Server Engineer", "")
];

function TeamPage() {
    return (
        <Page className="p-4 font-geist-mono">
            <h1 className="font-anton text-5xl font-bold">Our Team</h1>
            <p className="text-lg">
                Welcome to StockSensAI! This is a senior design project made by three aspiring Computer Engineers interested in software.
            </p>
            <div className="flex flex-row w-full gap-4 justify-center items-center mt-4">
                <Carousel>
                    <CarouselContent>
                        {
                            teamMembers && teamMembers.length > 0 ? (
                                teamMembers.map((member, index) => (
                                    <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
                                        <div className="p-1">
                                            <TeamCard key={index} member={member} />
                                        </div>
                                    </CarouselItem>

                                ))
                            ) : (
                                <p className="text-gray-500">No team members found.</p>
                            )
                        }
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 size-10 text-white" />
                    <CarouselNext className="absolute right-2 size-10 text-white" />
                </Carousel>
            </div>

        </Page>
    )
}

export default TeamPage;
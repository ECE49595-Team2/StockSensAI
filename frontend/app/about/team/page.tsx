"use client";
import Page from "@/components/new-page";
import TeamCard, { TeamMember } from "./team-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shadcn/ui/carousel";

const teamMembers: TeamMember[] = [
    new TeamMember("Lane Crowder", "UX Designer, Frontend Engineer", "Lane is interested in UX design and software development. He is currently a senior at Purdue University."),
    new TeamMember("Brett Heckman", "Algorithmic Trader Engineer", ""),
    new TeamMember("Kevin DeWall", "LLM Server Engineer", "")
];

function TeamPage() {
    return (
        <Page className="p-4 font-geist-mono">
            <div className="w-full ml-10 mt-10">
                <h1 className="font-anton text-5xl font-bold">Our Team</h1>
                <p className="text-xl max-w-200">
                    Welcome to StockSensAI! This is a senior design project made by three aspiring Computer Engineers interested in software.
                </p>
            </div>
            <div className="flex flex-row w-full gap-4 justify-center items-center mt-4">
                <Carousel>
                    <CarouselContent>
                        {
                            teamMembers && teamMembers.length > 0 ? (
                                teamMembers.map((member, index) => (
                                    <CarouselItem className="sm:basis-full md:basis-1/2 lg:basis-1/3 flex justify-center" key={index}>

                                        <TeamCard key={index} member={member} />

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
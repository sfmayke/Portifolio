import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";

const redis = Redis.fromEnv();

export const revalidate = 60;
export default async function ProjectsPage() {
	const views = (
		await redis.mget<number[]>(
			...allProjects.map((p) => p.slug),
		)
	).reduce((acc, v, i) => {
		acc[allProjects[i].slug] = v ?? 0;
		return acc;
	}, {} as Record<string, number>);

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Projects
					</h2>
					<p className="mt-4 text-zinc-400">
						Some of the projects are from work and some are on my own time.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />

				<div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
          {allProjects.map(p => (
            <Card slug={p.slug}>
						<Link href={p.url as string} target="_blank">
							<article className="relative h-full w-full p-4 md:p-8">
								<div className="flex justify-between gap-2 items-center">
									<div className="text-xs text-zinc-100">
										{p.date ? (
											<time dateTime={new Date(p.date).toISOString()}>
												{Intl.DateTimeFormat(undefined, {
													dateStyle: "medium",
												}).format(new Date(p.date))}
											</time>
										) : (
											<span>SOON</span>
										)}
									</div>
									<span className="text-zinc-500 text-xs  flex items-center gap-1">
										<Eye className="w-4 h-4" />{" "}
										{Intl.NumberFormat("en-US", { notation: "compact" }).format(
											views[p.slug] ?? 0,
										)}
									</span>
								</div>

								<h2
									id="featured-post"
									className="mt-4 text-3xl font-bold  text-zinc-100 group-hover:text-white sm:text-4xl font-display"
								>
									{p.title}
								</h2>
								<p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
									{p.description}
								</p>
								<div className="absolute bottom-4 md:bottom-8">
								</div>
							</article>
						</Link>
					</Card>
          ))}
				</div>
			</div>
		</div>
	);
}

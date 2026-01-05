import Link from "next/link";

const themes = [
	{
		id: "minimal",
		name: "Minimal",
		desc: "Clean layout focused on product photography and whitespace.",
		accent: "bg-indigo-500",
	},
	{
		id: "modern",
		name: "Modern",
		desc: "Bold typography and large hero sections for storytelling.",
		accent: "bg-rose-500",
	},
	{
		id: "classic",
		name: "Classic",
		desc: "Traditional e‑commerce layout with clear navigation.",
		accent: "bg-emerald-500",
	},
];

export default function ThemeLibrary() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold mb-4">Theme Library</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{themes.map((t) => (
					<div key={t.id} className="border rounded-lg overflow-hidden shadow-sm">
						<div className="h-40 flex items-center justify-center" aria-hidden>
							<div className={`w-5/6 h-3/5 rounded-md ${t.accent} bg-opacity-90`} />
						</div>
						<div className="p-4">
							<h2 className="font-medium text-lg">{t.name}</h2>
							<p className="text-sm text-gray-600 mt-1">{t.desc}</p>
							<div className="mt-4 flex gap-2">
								<Link
									href={`/dashboard/theme/customize?id=${t.id}`}
									className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
								>
									Customize
								</Link>
								<Link
									href={`/dashboard/theme/editor?id=${t.id}`}
									className="px-3 py-1 rounded-md border text-sm"
								>
									Live Editor
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}


"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const THEMES: Record<string, any> = {
	minimal: {
		name: "Minimal",
		description: "Clean layout focused on product photography and whitespace.",
		color: "#6366f1",
		font: "Inter",
		layout: "spacious",
	},
	modern: {
		name: "Modern",
		description: "Bold typography and large hero sections for storytelling.",
		color: "#fb7185",
		font: "Poppins",
		layout: "center",
	},
	classic: {
		name: "Classic",
		description: "Traditional e‑commerce layout with clear navigation.",
		color: "#10b981",
		font: "Georgia",
		layout: "boxed",
	},
};

export default function ThemeCustomize() {
	const search = useSearchParams();
	const router = useRouter();
	const id = search.get("id") || "minimal";

	const base = THEMES[id] || THEMES["minimal"];

	const [color, setColor] = useState(base.color);
	const [font, setFont] = useState(base.font);
	const [layout, setLayout] = useState(base.layout);
	const [description, setDescription] = useState(base.description);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		setColor(base.color);
		setFont(base.font);
		setLayout(base.layout);
		setDescription(base.description);
	}, [id]);

	function handleSave() {
		// For this demo we simply show a saved state and update URL to pass settings to the live editor.
		setSaved(true);
		setTimeout(() => setSaved(false), 1500);
		const params = new URLSearchParams({ id, color, font, layout });
		router.push(`/dashboard/theme/editor?${params.toString()}`);
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Customize: {base.name}</h1>
				<div className="text-sm text-gray-500">Preview changes live or open the editor</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<div className="border rounded-lg p-6">
						<h2 className="font-medium mb-2">Live Preview</h2>
						<div
							className="mt-4 rounded-md p-8 text-white"
							style={{ background: color, fontFamily: font }}
						>
							<h3 className="text-3xl font-bold">{base.name} Theme</h3>
							<p className="mt-2 max-w-xl">{description}</p>
						</div>
					</div>
				</div>

				<aside className="space-y-4">
					<div className="border rounded-lg p-4">
						<label className="block text-sm font-medium">Accent Color</label>
						<input
							type="color"
							value={color}
							onChange={(e) => setColor(e.target.value)}
							className="w-16 h-10 mt-2"
						/>
					</div>

					<div className="border rounded-lg p-4">
						<label className="block text-sm font-medium">Font</label>
						<select
							value={font}
							onChange={(e) => setFont(e.target.value)}
							className="mt-2 w-full border rounded px-2 py-1"
						>
							<option>Inter</option>
							<option>Poppins</option>
							<option>Georgia</option>
						</select>
					</div>

					<div className="border rounded-lg p-4">
						<label className="block text-sm font-medium">Layout</label>
						<select
							value={layout}
							onChange={(e) => setLayout(e.target.value)}
							className="mt-2 w-full border rounded px-2 py-1"
						>
							<option value="spacious">Spacious</option>
							<option value="center">Centered</option>
							<option value="boxed">Boxed</option>
						</select>
					</div>

					<div className="border rounded-lg p-4">
						<label className="block text-sm font-medium">Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="mt-2 w-full border rounded p-2 h-32"
						/>
					</div>

					<div className="flex gap-2">
						<button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">
							Save & Open Editor
						</button>
						<button
							onClick={() => setColor(base.color)}
							className="px-4 py-2 border rounded"
						>
							Reset
						</button>
					</div>

					{saved && <div className="text-sm text-green-600">Saved — opening editor...</div>}
				</aside>
			</div>
		</div>
	);
}


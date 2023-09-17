import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolById, getAllTools } from "@/lib/services/Tools.services";

export async function generateMetadata(params: {
  id: string;
}): Promise<Metadata> {
  const toolData: Promise<Tool> = getToolById(params.id);
  const tool = await toolData;
  if (!tool.name) {
    return { title: "Product not found!" };
  }
  return {
    title: tool.name,
    description: tool.description,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const toolData: Promise<Tool> = getToolById(params.id);
  const tool = await toolData;
  if (!tool.name) {
    return notFound();
  }
  return <div>Product details ID {params.id}</div>;
}

//this portion forces startic generation of all tools pages
export async function generateStaticParams() {
  const ToolsData: Promise<Tool[]> = getAllTools();
  const tools = await ToolsData;
  return tools.map((tool) => {
    id: tool.id;
  });
}

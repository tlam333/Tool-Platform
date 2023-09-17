import DisplayTool2 from "./DisplayTool2";
interface Props {
  tools: Tool[];
}

function ToolList({ tools }: Props) {
  return (
    // <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid grid-cols-1 gap-3">
      {tools.map((tool) => (
        <DisplayTool2 key={tool.id} tool={tool} />
      ))}
    </div>
  );
}

export default ToolList;

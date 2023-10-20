interface Props {
  color?: string;
}

export default function Loading({ color = "white" }: Props) {
  return <span className={`loading loading-spinner text-${color}`}></span>;
}

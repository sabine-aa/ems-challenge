import { useLoaderData } from "react-router"

export function loader() {
  return {
    message: 'hello world'
  }
}

export default function HomePage() {
  const { message } = useLoaderData()
  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

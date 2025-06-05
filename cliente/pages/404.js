import { useEffect } from "react"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"

export default function Custom404() {
    const router = useRouter()

    useEffect(() => {
        toast.error("Página no encontrada")
        router.replace("/")
    })

    return null
}
"use client";

import Header from "@/app/components/Header";

const probarBackend = async () => {
    const response = await fetch("http://localhost:5000/api/");
    const data = await response.json();
    console.log(data);
}

export default function Home() {
    return (
        <>
            <Header />
        </>
    );
}

"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RefferalDoctor() {
    const [rCond, setrCond] = useState(false);
    const [refferalDoctor, setRefferalDoctor] = useState();

    useEffect(() => {
        fetch('http://localhost:5000/refferal-doctor', {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then(res => res.json())
            .then(data => {
                setRefferalDoctor(data);
            })
            .catch(error => {
                console.error('Error fetching referral doctor data:', error);
            });
    }, [rCond]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target
        const doctorName = form.doctorName.value;

        try {
            const res =
                await fetch('http://localhost:5000/refferal-doctor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ doctorName }),
                });
            // const result = await res.json();
            setrCond(!rCond)
            form.reset()
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div className="border p-2 rounded">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <p>Add a refferal Doctor</p>
                    <hr className="my-2" />
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="doc">Insert a Refferal Doctor Name:</label>
                        <input
                            required
                            className="p-2 my-2 w-full rounded text-black"
                            type="text"
                            placeholder="Doctor Name"
                            name="doctorName"
                        />
                        <div className="text-right">
                            <input className="p-2 px-8 border rounded mt-1 bg-cyan-600 cursor-pointer" type="submit" value={"Submit"} />
                        </div>
                    </form>
                </div>
                <div>
                    <h3>All Refferal Doctor List :</h3>
                    <hr className="my-2" />
                    {
                        refferalDoctor?.map((doctor, index) => <div className="py-1 flex justify-between" key={index}>
                            <p>{index + 1}. {doctor?.doctorName} </p>
                            <span>
                                <Link href='' className="rounded border px-2 block">Edit</Link>
                                <Link href=''></Link>
                            </span>
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
}

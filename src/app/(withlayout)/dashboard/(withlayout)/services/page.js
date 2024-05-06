'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Services() {
    const [rload, setRload] = useState(false)
    const [services, setServices] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/services", {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setServices(data)
            })
    }, [rload])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target
        const serviceName = form.serviceName.value
        const price = form.price.value
        const department = form.department.value
        const reportLabel = form.reportLabel.value

        const newService = {
            value: serviceName,
            label: serviceName,
            price,
            department,
            reportLabel
        }

        try {
            const res =
                await fetch('http://localhost:5000/services', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newService),
                });

            // const result = await res.json();
            form.reset()
            setRload(!rload)
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div className="border p-2 rounded">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <p>Add a Service</p>
                    <hr className="my-2" />
                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-2 lg:gap-2">
                            <div>
                                <label>Insert a Service Name:</label>
                                <input
                                    required
                                    className="p-2 my-2 w-full rounded text-black"
                                    type="text"
                                    placeholder="as Value"
                                    name="serviceName"
                                />
                            </div>
                            <div>
                                <label>Report Label:</label>
                                <input
                                    required
                                    className="p-2 my-2 w-full rounded text-black"
                                    type="text"
                                    placeholder="Report Label"
                                    name="reportLabel"
                                />
                            </div>
                            <div>
                                <label>Insert price</label>
                                <input
                                    required
                                    className="p-2 my-2 w-full rounded text-black"
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                />
                            </div>
                            <div>
                                <label>Select a department</label>
                                <select
                                    required
                                    className="p-2 my-2 w-full rounded text-black"
                                    type="text"
                                    placeholder="Price"
                                    name="department"
                                >
                                    <option value="">-- Select --</option>
                                    <option value="biochemistry">Biochemistry</option>
                                    <option value="hematology">Hematology</option>
                                    <option value="microbiology">Microbiology</option>
                                    <option value="immunology">Immunology</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-right">
                            <input className="p-2 px-8 border rounded mt-1 bg-cyan-600 cursor-pointer" type="submit" value={"Submit"} />
                        </div>
                    </form>
                </div>

                <div>
                    <h3>All Service List :</h3>
                    <hr className="my-2" />
                    <table className="w-full">
                        <thead>
                            <tr>
                                <td>Sl.</td>
                                <td>Service Name</td>
                                <td>Department</td>
                                <td>Rate</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                services?.map((service, index) => <tr key={service?._id}>
                                    <td>{index + 1}.</td>
                                    <td>{service.label}</td>
                                    <td>{service.department}</td>
                                    <td>{service.price}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

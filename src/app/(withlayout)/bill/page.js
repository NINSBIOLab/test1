"use client"
import { useEffect, useRef, useState } from "react";
import Select from "react-select"
import { useReactToPrint } from "react-to-print";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function Bill() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [selectedData, setSelectedData] = useState([]);
    const [total, setTotalPrice] = useState(0);
    const [finalSum, setFinalSum] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [dicountPercent, setdicountPercent] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paidStatus, setPaidStatus] = useState(false);
    const [due, setDue] = useState(0);
    const [refDoctor, setRefDoctor] = useState();
    const [options, setOptions] = useState([]);
    const [amountInWords, setAmountInWords] = useState();
    const [localDate, setLocalDate] = useState();
    const [billDateTime, setBillDateTime] = useState();
    const [dbDate, setDbDate] = useState();
    const [formData, setFormData] = useState({
        name: '',
        sex: '',
        age: '',
        address: '',
        mobileNo: '',
        refDoctor: '',
    });
    let converter = require('number-to-words');

    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dbDate = `${year}-${month}-${day}`;
        setDbDate(dbDate);


        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        setBillDateTime(date.toLocaleString())
        setLocalDate(formattedDate);


        // Create a new Date object
        // let ww = new Date();
        // ww.setDate(ww.getDate() + 1);
        // console.log(ww);

        const name = Cookies.get("name");
        setUser(name);

    }, []);

    useEffect(() => {

        fetch('http://localhost:5000/services')
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setOptions(data);
            }
            )

        fetch('http://localhost:5000/refferal-doctor')
            .then(res => res.json())
            .then(data => {
                setRefDoctor(data);
            }
            )
    }, []);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: "lightgray",
            color: "black"
        }),

        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'blue' : state.isFocused ? 'lightblue' : 'white',
            color: 'black'
        })
    };

    const handleChange = (selectedOption) => {
        // console.log("Selected Options", selectedOption);
        setSelectedData(selectedOption)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        let totalPrice = 0;
        selectedData.forEach(item => {
            totalPrice += parseFloat(item.price);
        });

        const discountMoney = Math.round(totalPrice * (dicountPercent / 100));
        const finaleAmount = totalPrice - discountMoney;
        const due = finaleAmount - paidAmount;

        setTotalPrice(totalPrice)
        setFinalSum(finaleAmount);
        setDue(due)
        // 
        setAmountInWords(converter.toWords(finaleAmount).toUpperCase());

        if (due === 0) {
            setPaidStatus(true)
        } else {
            setPaidStatus(false)
        }

    }, [selectedData, dicountPercent, paidAmount, converter]);

    // print the page
    const billRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => billRef.current,
    });

    const handleSubmit = () => {
        const data = {
            localDate,
            dbDate,
            name: formData.name,
            sex: formData.sex,
            age: formData.age,
            address: formData.address,
            mobileNo: formData.mobileNo,
            refDoctor: formData.refDoctor,
            investigations: selectedData,
            totalMoney: total,
            discountPercent: dicountPercent,
            discountAmount: discountAmount,
            finalSum,
            paidAmount: paidAmount,
            dueMoney: due,
            paidStatus: paidStatus
        }
        handlePrint()
        console.log(data);
    }

    return (
        <div>
            <div className="max-w-[1380px] min-h-screen mx-auto p-4 border border-lime-600">
                <h1 className="text-center text-xl border border-cyan-600 p-2 rounded">Please Insert the following fields to crate a bill</h1>
                <div className="grid grid-cols-2 gap-2 pt-4">
                    <div className="border p-3 rounded">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label>Name:</label>
                                <input name="name"
                                    onChange={handleInputChange} 
                                    className="p-2 w-full rounded text-black" 
                                    type="text" 
                                    placeholder="Name" />
                            </div>
                            <div>
                                <label>Sex:</label>
                                <select name="sex"
                                    onChange={handleInputChange} className="p-2 w-full rounded text-black">
                                    <option value="Null">--- Select ---</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div>
                                <label>Age:</label>
                                <input
                                    name="age" onChange={handleInputChange} className="p-2 w-full rounded text-black" type="number" placeholder="Age" />
                            </div>
                            <div>
                                <label>Mobile Number:</label>
                                <input
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded text-black"
                                    type="number"
                                    placeholder="Mobile Number"
                                    name="mobileNo"
                                />
                            </div>
                            <div className="col-span-2">
                                <label>Address:</label>
                                <input
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded text-black"
                                    type="text"
                                    placeholder="Address"
                                    name="address"
                                />
                            </div>
                            <div className="col-span-2">
                                <label>Referral Doctor:</label>
                                <select
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded text-black"
                                    name="refDoctor"
                                >
                                    <option value="Null">--- Select ---</option>
                                    {refDoctor?.map((doctor) => (
                                        <option key={doctor._id} value={doctor.doctorName}>
                                            {doctor.doctorName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <h3>Select Investigations :</h3>
                                <Select
                                    id="selectbox"
                                    instanceId="selectbox"
                                    options={options}
                                    isMulti
                                    styles={customStyles}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border p-3 rounded">
                        <h3 className="text-lg">Investigations :</h3>
                        <hr className="my-1" />
                        <div className="min-h-[220px] overflow-scrool">
                            {
                                selectedData?.map((item, index) =>
                                    <p className="flex justify-between" key={index}><span>{index + 1}. {item.label}</span><span>{item.price}/=</span></p>
                                )
                            }
                        </div>
                        <hr className="my-1" />
                        <div>
                            <p className="flex justify-between"><span>Total</span> <span>{total}/=</span></p>
                            <hr className="my-1" />
                            <div className="grid grid-cols-2 items-center gap-2">
                                <div className="grid grid-cols-3 items-center">
                                    <label className="col-span-2">Discount (in percent)</label>
                                    <input
                                        defaultValue={dicountPercent}
                                        onChange={(e) => {
                                            if (e.target.value > 100 || e.target.value < 0) {
                                                alert("Invalid Input")
                                                setdicountPercent(0)
                                                e.target.value = 0;
                                            }
                                            else {
                                                setdicountPercent(e.target.value)
                                            }
                                        }}
                                        type="number"
                                        placeholder="%"
                                        className="p-2 w-full rounded text-black"
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <span>Final Amount</span>
                                    <span>{finalSum}/=</span>
                                </div>
                            </div>
                            <hr className="my-1" />
                            <div className="grid grid-cols-2 items-center">
                                <label>Paid</label>
                                <input
                                    onChange={(e) => {
                                        setPaidAmount(e.target.value)
                                    }}
                                    type="number"
                                    placeholder="Amount"
                                    className="p-2 w-full rounded text-black text-right " />
                            </div>
                            <hr className="my-1" />
                            <p className="flex justify-between"><span>Due</span> <span>{due}/=</span></p>
                        </div>

                    </div>
                </div>

                <div className="text-end">
                    <button onClick={handleSubmit} className="p-2 px-4 border rounded mt-1 bg-cyan-600">Save & Print</button>
                </div>
            </div>

            {/* print component */}
            <div className="hidden">
                <div ref={billRef} className="p-4 text-black h-[793px] relative text-[14px]">
                    <div className="text-center">
                        <h1 className="text-[20px] font-bold">DEMO DIAGNOSTIC & CONSULTATION</h1>
                        <p className="pb-2">Sher-E-Bangla Nagar, Agargaon, Dhaka - 1207</p>

                        <p className="border rounded border-black font-bold">Money Receipt</p>
                    </div>

                    <div className="rounded p-2 mt-1 border border-black">
                        <div className="grid grid-cols-3">
                            <p className="col-span-2"><span className="inline-block min-w-[80px]">Bill Id </span>: Bill Id</p>
                            <p><span className="inline-block min-w-[50px]">Date </span> : {localDate}</p>
                            <p className="col-span-2"><span className="inline-block min-w-[80px]">Name </span>: {formData.name}</p>
                            <p><span className="inline-block min-w-[50px]">Age </span> : {formData.age} Yrs</p>
                            <p className="col-span-2"><span className="inline-block min-w-[80px]">Mobile No </span>: {formData.mobileNo}</p>
                            <p><span className="inline-block min-w-[50px]">Sex </span> : {formData.sex}</p>
                            <p className="col-span-3"><span className="inline-block min-w-[80px]">Address </span>: {formData.address}</p>
                            <p className="col-span-3"><span className="inline-block min-w-[80px]">Ref By </span>: {formData.refDoctor}</p>
                        </div>
                    </div>

                    <div className="rounded p-2 mt-1 border border-black relative">
                        <span className="font-bold underline">Investigations</span>
                        {
                            selectedData?.map((item, index) =>
                                <p className="flex justify-between" key={index}><span>{index + 1}. {item.label}</span><span>{item.price} Taka</span></p>
                            )
                        }
                        <span className="block my-1 bg-black h-[1px]"></span>
                        <p className="text-right">Total : {total} Taka</p>
                    </div>

                    <div className="rounded px-2 mt-1 relative">
                        {/* tag */}
                        <p className="border border-black rounded p-2 absolute left-[10px] bottom-[50px] font-bold text-[20px] px-16 -rotate-12">
                            {paidStatus ? "Paid" : "Due"}
                        </p>

                        <div className="flex justify-end items-center">

                            <div className="inline-block min-w-[200px]">
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td>Discount</td>
                                            <td>:</td>
                                            <td className="text-right"> {dicountPercent} </td>
                                            <td className="text-right">%</td>
                                        </tr>
                                        <tr>
                                            <td>Sub Total</td>
                                            <td>:</td>
                                            <td className="text-right"> {finalSum} </td>
                                            <td className="text-right">Taka</td>
                                        </tr>
                                        <tr>
                                            <td>Paid</td>
                                            <td>:</td>
                                            <td className="text-right"> {paidAmount} </td>
                                            <td className="text-right">Taka</td>
                                        </tr>
                                        <tr>
                                            <td>Due</td>
                                            <td>:</td>
                                            <td className="text-right"> {due} </td>
                                            <td className="text-right">Taka</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p>Total Bill (In Words):  {amountInWords} Taka</p>

                        <span className="block my-1 bg-black h-[1px]"></span>
                    </div>

                    <div className="absolute left-[0px] bottom-[0px] w-full px-8 py-2">
                        <div className="flex justify-between">
                            <p>Powered By R.Sarker</p>
                            <p>{user} , {billDateTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
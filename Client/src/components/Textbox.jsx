import React from 'react'

const Textbox =React.forwardRef( ({type, placeholder, label, className, register, name, error}, ref) => {
  return (
   <div className="w-full flex flex-col gap-1">
    {label && <label htmlFor={name} className='text-slate-800'>{label}</label>}
    <div>
        <input
        type={type}
        name={name}
        placeholder={placeholder}
        ref={ref}
        {...register}
        aria-invalid={error? "true":"false"}
        className='w-full bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-600 text-gray-900 outline-none text-base rounded-full focus:ring-2 ring-blue-300'/> 
    </div>
    {error && (
        <span className="text-xs text-red-600 mt-0.5">{error}</span>
    )}
   </div> 
  )
}
);
export default Textbox
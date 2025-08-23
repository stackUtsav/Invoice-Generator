import React from 'react';
import InvoiceField from './InvoiceField';

const InvoiceItem = ({ id, name, qty, price, onDeleteItem, onEdtiItem }) => {
  const deleteItemHandler = () => {
    onDeleteItem(id);
  };

  return (
    <tr className="bg-white transition-colors hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/60">
      <td className="w-full px-3 py-3">
        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            placeholder: "Item name",
            type: "text",
            name: "name",
            id: id,
            value: name,
            className:
              "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
          }}
        />
      </td>

      <td className="min-w-[65px] px-3 py-3 md:min-w-[80px]">
        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            type: "number",
            min: "1",
            name: "qty",
            id: id,
            value: qty,
            className:
              "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-right shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
          }}
        />
      </td>

      <td className="relative min-w-[100px] px-3 py-3 md:min-w-[150px]">
        {/* Rupee icon at left of the input */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 sm:left-3 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* ₹ outline icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 4h12M6 8h12M12 20l-6-8h3a6 6 0 006-6"
          />
        </svg>

        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            className:
              "w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-right text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
            type: "number",
            min: "0.01",
            step: "0.01",
            name: "price",
            id: id,
            value: price,
          }}
        />
      </td>

      <td className="px-3 py-3">
        <button
          className="inline-flex items-center justify-center rounded-lg bg-red-500 p-2 text-white shadow-sm transition
                     hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 active:scale-95"
          onClick={deleteItemHandler}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default InvoiceItem;

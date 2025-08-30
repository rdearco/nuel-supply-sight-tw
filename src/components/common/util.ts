export const getStatusBadge = (status: string, includeFixedWidth: boolean = false) => {
  const baseClasses = `inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold${includeFixedWidth ? ' w-20' : ''}`;
  
  switch (status) {
    case 'Healthy':
      return `${baseClasses} bg-green-500 text-white`;
    case 'Low':
      return `${baseClasses} bg-yellow-500 text-white`;
    case 'Critical':
      return `${baseClasses} bg-red-500 text-white`;
    default:
      return `${baseClasses} bg-gray-500 text-white`;
  }
};
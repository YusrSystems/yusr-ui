interface YusrButtonProps {
  label: string;
  onClick?: () => void;
}

export const YusrButton = ({ label, onClick }: YusrButtonProps) => {
  return (
    <button 
      onClick={onClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontFamily: 'sans-serif'
      }}
    >
      {label}
    </button>
  );
};
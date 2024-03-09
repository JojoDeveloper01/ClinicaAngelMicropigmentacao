interface BenefitsProps { beneficios: string[]; }

const Benefits: React.FC<BenefitsProps> = ({ beneficios }) => {
  return (
    <ol className="benefitsWords">
      {beneficios.map((beneficio, index) => (
        <li
          key={index}
          dangerouslySetInnerHTML={{ __html: beneficio }}
        ></li>
      ))}
    </ol>
  );
};

export default Benefits;

import '@pages/servicos/_servicos.css';

interface ToJSONProps {
  add: string
  tag: React.ElementType
  className?: string;
}

const ToJSON: React.FC<ToJSONProps> = ({ add, tag: Tag, className }) => {
  return (
    <Tag className={className} dangerouslySetInnerHTML={{ __html: add }}></Tag>
  );
};

export default ToJSON;
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";
const Container = ({
  children,
  className = ""
}) => {
  return <div className={`${DEFAULT_MAX_WIDTH_CLASS} ${className}`}>
      {children}
    </div>;
};
var stdin_default = Container;
export {
  stdin_default as default
};

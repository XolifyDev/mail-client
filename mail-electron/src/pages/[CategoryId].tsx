import { accounts, mails } from "@/components/mail/data";
import { Mail } from "@/components/mail/mail";
import useEmailStore from "@/lib/store/Email";
import { useParams, useNavigate } from "react-router-dom";
import cookies from "js-cookie";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const emailStore = useEmailStore();
    const auth = useContext(AuthContext)
    const layout = cookies.get("react-resizable-panels:layout") === "undefined" ? undefined : cookies.get("react-resizable-panels:layout");
    const collapsed = cookies.get("react-resizable-panels:collapsed") === "undefined" ? undefined : cookies.get("react-resizable-panels:collapsed");
    console.log(auth)
    const defaultLayout = layout ? JSON.parse(layout || "") : undefined
    const defaultCollapsed = collapsed ? JSON.parse(collapsed || "") : undefined

    if (!categoryId) return navigate("/mail");

    if(!auth.user) return <Loader size={50} className="animate-spin absolute ml-[50dvw] mt-[45dvh]" />
    return (
        <>
            <div className="md:hidden">
                <img
                    src="/examples/mail-dark.png"
                    width={1280}
                    height={727}
                    alt="Mail"
                    className="hidden dark:block"
                />
                <img
                    src="/examples/mail-light.png"
                    width={1280}
                    height={727}
                    alt="Mail"
                    className="block dark:hidden"
                />
            </div>
            <div className="hidden flex-col md:flex">
                <Mail
                    accounts={[auth.user]}  
                    mails={emailStore.emails.reverse()}
                    defaultLayout={defaultLayout}
                    defaultCollapsed={defaultCollapsed}
                    navCollapsedSize={4}
                />
            </div>
        </>
    )
}

export default CategoryPage
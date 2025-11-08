import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Edit3, LogOut} from "lucide-react";
import {getAuthToken} from "@/config/api.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/hooks/use.Auth.ts";
import {useEffect} from "react";

export function ProfilePage() {

    const token = getAuthToken();
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);


    const {logout} = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <DashboardLayout>
            <div className={'flex-col flex size-full gap-8'}>
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Perfil</h2>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-5">
                            <div
                                className="h-12 w-12 rounded-full bg-indigo-600 text-white grid place-items-center font-bold">
                                F
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">Federica</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">fede@example.com</p>
                            </div>
                            <Button variant="outline">
                                <Edit3 size={16}/> Editar
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className={'flex w-full justify-center'}>
                    <Button className="bg-red-500 w-40 flex items-center justify-center" onClick={handleLogout}>
                        <LogOut/>
                        <p className={'font-semibold text-base'}>Logout</p>
                    </Button>
                </div>
            </div>
        </DashboardLayout>

    );
}

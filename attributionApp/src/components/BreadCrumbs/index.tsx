import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import type { Composer } from "../../modules/types";

interface Props {
    selectedUnit: Composer | null
}

const Breadcrumbs = ({ selectedUnit }: Props) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{location.pathname == "/" &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/units") &&
                <BreadcrumbItem active>
                    <Link to="/units">
						Подразделения
                    </Link>
                </BreadcrumbItem>
			}
            {selectedUnit &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedUnit.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs
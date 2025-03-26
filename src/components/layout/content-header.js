const ContentHeader = ({title, subtitle}) => {

    return (
        <>
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-0">
                        <div class="col-sm-6">
                            <h5 class="m-0">{title}</h5>
                        </div>
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item active">{subtitle}</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ContentHeader;
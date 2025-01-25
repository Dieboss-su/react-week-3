function Pagination ({
    pagination,
    handlePage
}){
    return(
    <>
        {pagination && <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a className={`page-link ${!pagination.has_pre && "disabled"}`} href="#" onClick={()=>{handlePage(pagination.current_page-1)}}>
                上一頁
              </a>
            </li>
            {Array.from({length : pagination.total_pages}).map((_,index)=>{
              return(
                <li className="page-item" key={index+10}>
              <a className={`page-link ${pagination.current_page === index+1 && "active"}`} href="#" onClick={()=>{handlePage(index+1)}}>
                {index+1}
              </a>
            </li>
              )
            })}
            

            <li className="page-item">
              <a className={`page-link ${!pagination.has_next && "disabled"}`} href="#" onClick={()=>{handlePage(pagination.current_page+1)}}>
                下一頁
              </a>
            </li>
          </ul>
        </nav>
        </div>}
        </>
    )
}

export default Pagination;
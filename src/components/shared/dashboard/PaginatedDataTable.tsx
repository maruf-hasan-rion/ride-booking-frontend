import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginatedDataTableProps = {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
};

export const PaginatedDataTable = ({
  currentPage,
  totalPage,
  onPageChange,
  children,
}: PaginatedDataTableProps) => {
  return (
    <div className="container mx-auto p-4">
      {children}
      {totalPage > 1 && (
        <div className="mt-4 flex w-full justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page} onClick={() => onPageChange(page)}>
                  <PaginationLink isActive={currentPage === page}>{page}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPage))}
                  className={currentPage === totalPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

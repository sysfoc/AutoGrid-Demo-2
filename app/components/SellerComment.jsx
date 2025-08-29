import { MessageSquareTextIcon } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const SellerComment = ({ loadingState, car, translation: t }) => {
  const loading = loadingState
  const comments = car?.sellerComments || car?.sellercomments || ""

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-md transition-colors duration-200">
        <MessageSquareTextIcon className="h-5 w-5 text-[var(--text-inverse)] dark:text-gray-100" />
        <h3 className="text-sm font-semibold text-[var(--text-inverse)] dark:text-gray-100">{t("sellerComments")}</h3>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="space-y-2 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-[var(--bg)] dark:bg-[var(--bg-secondary)]">
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} width="80%" />
          </div>
        ) : comments ? (
          <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-[var(--bg)] dark:bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-gray-600 transition-colors duration-200">
            <p className="text-sm text-[var(--text)]">{comments}</p>
          </div>
        ) : (
          <div className="p-6 text-center border border-gray-200 dark:border-gray-600 rounded-md bg-[var(--bg)] dark:bg-[var(--bg-secondary)]">
            <MessageSquareTextIcon className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
            <p className="text-sm text-[var(--text-secondary)]">No Comments Available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerComment
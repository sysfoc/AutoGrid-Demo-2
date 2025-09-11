import { MessageSquareTextIcon } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const SellerComment = ({ loadingState, car, translation: t }) => {
  const loading = loadingState
  const comments = car?.sellerComments || car?.sellercomments || ""

return (
  <div className="space-y-4" role="region" aria-label="Seller comments section">
    {/* Header */}
    <div className="flex items-center gap-2 p-3 bg-purple-600 rounded-md" role="banner" aria-label="Seller comments section header">
      <MessageSquareTextIcon className="h-5 w-5 text-white" role="img" aria-label="Comments icon" />
      <h3 className="text-sm font-semibold text-white" role="heading" aria-level="3">{t("sellerComments")}</h3>
    </div>

    {/* Content */}
    <div role="main" aria-label="Seller comments content">
      {loading ? (
        <div className="space-y-2 p-3 border rounded-md" role="status" aria-label="Loading seller comments">
          <Skeleton height={16} aria-label="Loading comment line 1" />
          <Skeleton height={16} aria-label="Loading comment line 2" />
          <Skeleton height={16} width="80%" aria-label="Loading comment line 3" />
        </div>
      ) : comments ? (
        <div className="p-3 border rounded-md" role="article" aria-label="Seller comments">
          <p className="text-sm text-gray-700 dark:text-gray-100" role="text" aria-label={`Seller comment: ${comments}`}>{comments}</p>
        </div>
      ) : (
        <div className="p-6 text-center border rounded-md" role="status" aria-label="No comments available">
          <MessageSquareTextIcon className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" role="img" aria-label="No comments icon" />
          <p className="text-sm text-gray-700 dark:text-gray-300" role="text">No Comments Available</p>
        </div>
      )}
    </div>
  </div>
)
}

export default SellerComment

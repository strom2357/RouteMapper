class Following < ActiveRecord::Base
  has_one(
  	:followed_user,
  	class_name: "User",
  	foreign_key: :id,
  	primary_key: :followed_user_id
  )
  belongs_to :user
end

class Ride < ActiveRecord::Base
	validates :user_id, :title, :date, presence: true

	belongs_to(:user)
end

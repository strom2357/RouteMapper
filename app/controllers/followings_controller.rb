class FollowingsController < ApplicationController
	before_action :require_signed_in!

	def create
		#try to remove once working
		sleep(1)

		followed_user_id = params[:user_id]

		@follow = Following.create!({user_id: current_user.id,
			followed_user_id: followed_user_id});

		render json: @follow
	end

	def destroy
		sleep(1)

		@follow = current_user.followings.find_by(followed_user_id: params[:user_id])
		@follow.destroy!

		render json: @follow
	end
end


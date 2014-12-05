class FollowingsController < ApplicationController
	before_action :require_signed_in!

	def create
		sleep(1)

		followed_user_id = params[:user_id]
		user_to_follow = User.find(params[:user_id])

		if (!current_user.followed_users.include?(user_to_follow))
			@follow = Following.create!({user_id: current_user.id,
				followed_user_id: followed_user_id});

			render json: @follow
		else
			@follow = current_user.followings.find_by(followed_user_id: params[:user_id])
			@follow.destroy!

			render json: @follow
		end
	end

	def destroy
		sleep(1)

		@follow = current_user.followings.find_by(followed_user_id: params[:user_id])
		@follow.destroy!

		render json: @follow
	end
end


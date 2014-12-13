class UsersController < ApplicationController
	def new
		@user = User.new
	end

	def index
		#cheating -- using this as a show route for the current user. 
		#this gets used in the index, but there's almost surely a better way to 
		#do the same thing
		@user = current_user
		render json: @user
	end

	def show
		@user = User.find(params[:id])
		render json: @user
	end

	def create
		@user = User.new(user_params)
		if @user.save
			sign_in(@user)
			redirect_to root_url
		else
			flash.now[:errors] = @user.errors.full_messages
			render :new
		end
	end

	def search
		if params[:query].present?
			@users = User.where("username ~ ?", params[:query])
		else
			@users = User.none
		end

		render json: @users
		# respond_to do |format|
		# 	format.html { render :search }
		# 	format.json { render :search }
		# end
	end

	private
	def user_params
		params.require(:user).permit(:password, :username)
	end
end

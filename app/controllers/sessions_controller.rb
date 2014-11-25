class SessionsController < ApplicationController
	def new
	end

	def create
		user = User.find_by_credentials(
			params[:user][:username],
			params[:user][:password]
		)

		if user
			sign_in(user)
			render json: "add redirect in sessions create"
		else
			flash.now[:errors] = ["Invalid username or password"]
			render :new
		end
	end

	def destroy
		sign_out
		render json: "need to add a redirect to session_destroy"
	end
end

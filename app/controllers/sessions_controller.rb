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
			redirect_to '#'
		else
			flash.now[:errors] = ["Invalid username or password"]
			render :new
		end
	end

	def destroy
		if current_user.username == "Guest"
			rides = Ride.where(username: "Guest")
			newrides = rides.where("created_at > ?", Time.gm(2014, 12, 16))
			newrides.destroy_all
		end
		sign_out
		redirect_to new_session_url
	end
end

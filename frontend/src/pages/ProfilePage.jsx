import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "./Posts.jsx";
import ProfileHeaderSkeleton from "../skeletons/ProfileHeaderSkeleton.jsx";
import EditProfileModal from "../components/EditProfileModal.jsx";

import { POSTS } from "../utils/dummy";

import { ArrowLeft, Calendar, ExternalLink,  Edit} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../utils/functions.js";
import useFollow from "../hooks/useFollow.jsx"
import useUpdateProfile from "../hooks/useUpdateProfile.jsx";

const ProfilePage = () => {
	const [coverPicture, setcoverPicture] = useState(null);
	const [profilePicture, setprofilePicture] = useState(null);
	const [feedType, setFeedType] = useState("posts");

	const coverPictureRef = useRef(null);
	const profilePictureRef = useRef(null);

	const{username}= useParams()

	const { follow, isPending } = useFollow();

	const queryClient= useQueryClient();



  const {data:authUser}= useQuery({queryKey:['authUser']});

	const {data:user, isLoading, refetch, isRefetching}= useQuery({
		queryKey:['userProfile'],
		queryFn: async ()=>{
			try {
				const response = await fetch (`/api/users/profile/${username}`)
				const data = await response.json()
				 if(!response.ok){
          throw new Error(data.error || "Something went wrong")
        }
				return data
				
			} catch (error) {
				throw new Error(error.message)
			}
		}
		})

		const{updateProfile, isUpdating}= useUpdateProfile();


		const isMyProfile = authUser._id === user?._id
		const memberSinceDate = formatMemberSinceDate(user?.createdAt)
		const amIfollowing= authUser?.following.includes(user?._id)

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverPicture" && setcoverPicture(reader.result);
				state === "profilePicture" && setprofilePicture(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(()=>{
		refetch()
	},[username, refetch])

	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{isLoading || isRefetching && <ProfileHeaderSkeleton />}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<ArrowLeft size={16} />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverPicture || user?.coverPicture || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverPictureRef.current.click()}
									>
										<Edit size={20} className='text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									ref={coverPictureRef}
                  accept="image/*"
									onChange={(e) => handleImgChange(e, "coverPicture")}
								/>
								<input
									type='file'
									hidden
									ref={profilePictureRef}
									onChange={(e) => handleImgChange(e, "profilePicture")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profilePicture || user?.profilePicture || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<Edit
													size={16}
													className='text-white'
                          accept="image/*"
													onClick={() => profilePictureRef.current.click()}
												/>
											)}
										</div>
									</div>h
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal authUser={authUser} />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() =>follow(user?._id)}
									>
										{isPending && "Loading..."}
										{!isPending && amIfollowing &&"Unfollow"}
										{!isPending && !amIfollowing &&"Follow"}

									</button>
								)}
								{(coverPicture || profilePicture) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={async () => {await updateProfile({coverPicture, profilePicture})
										setprofilePicture(null)
										setcoverPicture(null)
									}
									
									}
										
									>
										{isUpdating ? "Updating..." : "Update"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<ExternalLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link.startsWith('http://') || user?.link.startsWith('https://') ? user?.link : `https://${user?.link}`}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<Calendar size={16} className='text-slate-500' />
									<span className='text-sm text-slate-500'>{memberSinceDate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-primary/20 transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-primary/20 transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedType={feedType} username={username} userId={user?._id}/>
				</div>
			</div>
		</>
	);
};
export default ProfilePage;
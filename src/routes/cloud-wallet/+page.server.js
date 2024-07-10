/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({request}) => {
        const data = await request.formData();
		
    
    return { success: true };
	}
};
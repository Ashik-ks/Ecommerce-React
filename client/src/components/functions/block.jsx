import axios from 'axios';

export async function BlockorUnblock(pid, setSuccessMessage, setErrorMessage, id,description) {
    try {
        // Retrieve the token from localStorage
        let token = localStorage.getItem(id);
        
        if (!token) {
            setErrorMessage('No token found. Please log in again.');
            return;
        }

        // Send the token in the Authorization header
        const response = await axios.put(
            `http://localhost:3000/blockorunblock/${pid}/${description}`, 
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data.success) {
            setSuccessMessage(response.data.message); // Show success
            setErrorMessage(''); // Clear previous errors
        } else {
            setErrorMessage(response.data.message || 'Failed to block/unblock');
        }
    } catch (error) {
        setErrorMessage(
            error.response?.data?.message || 'An error occurred. Please try again.'
        );
    }
}

